#!/usr/bin/env python3
"""
诊断脚本 - 帮助排查 Gemini API 调用问题
"""

import os
import json
import requests
from google.oauth2 import service_account
import google.auth.transport.requests

def diagnose():
    """诊断问题"""
    print("=" * 60)
    print("🔍 Gemini API 诊断工具")
    print("=" * 60)
    
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if not key_path:
        print("❌ 环境变量未设置")
        return
    
    print(f"\n✓ 密钥文件: {key_path}")
    
    # 加载凭证
    credentials = service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/generative-language']
    )
    
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    access_token = credentials.token
    
    project_id = credentials.project_id if hasattr(credentials, 'project_id') else None
    print(f"✓ 项目ID: {project_id}")
    print(f"✓ 服务账号: {credentials.service_account_email}")
    
    # 测试不同的端点
    endpoints = [
        {
            "name": "标准端点 (v1beta)",
            "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent"
        },
        {
            "name": "Vertex AI 端点",
            "url": f"https://us-central1-aiplatform.googleapis.com/v1/projects/{project_id}/locations/us-central1/publishers/google/models/gemini-1.5-pro:predict"
        },
        {
            "name": "简化模型名",
            "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        }
    ]
    
    print("\n" + "=" * 60)
    print("🧪 测试不同的 API 端点...")
    print("=" * 60)
    
    payload = {
        "contents": [{
            "parts": [{"text": "Hi"}]
        }]
    }
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    for endpoint in endpoints:
        print(f"\n测试: {endpoint['name']}")
        print(f"URL: {endpoint['url']}")
        try:
            response = requests.post(endpoint['url'], headers=headers, json=payload, timeout=10)
            print(f"状态码: {response.status_code}")
            if response.status_code == 200:
                print("✅ 成功！")
                result = response.json()
                print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)[:200]}...")
                return True
            else:
                print(f"❌ 失败: {response.text[:200]}")
        except Exception as e:
            print(f"❌ 错误: {e}")
    
    print("\n" + "=" * 60)
    print("💡 解决建议")
    print("=" * 60)
    print("\n1. 确认已启用 Generative Language API:")
    print("   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com")
    print(f"   项目: {project_id}")
    print("\n2. 确认服务账号有权限:")
    print(f"   账号: {credentials.service_account_email}")
    print("   需要角色: Generative Language User 或 Vertex AI User")
    print("\n3. 检查是否需要在 Google AI Studio 创建 API Key:")
    print("   https://aistudio.google.com/apikey")
    print("\n4. 如果是首次使用，可能需要等待几分钟让权限生效")

if __name__ == "__main__":
    diagnose()

