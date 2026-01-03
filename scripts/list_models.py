#!/usr/bin/env python3
"""
列出可用的 Gemini 模型
"""

import os
import json
import requests
from google.oauth2 import service_account
import google.auth.transport.requests

def list_models():
    """列出可用的模型"""
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    credentials = service_account.Credentials.from_service_account_file(
        key_path,
        scopes=['https://www.googleapis.com/auth/generative-language']
    )
    
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    
    url = "https://generativelanguage.googleapis.com/v1beta/models"
    headers = {
        "Authorization": f"Bearer {credentials.token}",
        "Content-Type": "application/json"
    }
    
    print("正在获取可用模型列表...\n")
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        models = response.json()
        print("=" * 60)
        print("✅ 可用模型列表:")
        print("=" * 60)
        
        if 'models' in models:
            for model in models['models']:
                name = model.get('name', '')
                display_name = model.get('displayName', '')
                description = model.get('description', '')
                
                # 只显示支持 generateContent 的模型
                supported_methods = model.get('supportedGenerationMethods', [])
                if 'generateContent' in supported_methods:
                    print(f"\n📌 {display_name or name}")
                    print(f"   名称: {name}")
                    if description:
                        print(f"   说明: {description}")
        
        return models
    else:
        print(f"❌ 错误 {response.status_code}: {response.text}")
        return None

if __name__ == "__main__":
    list_models()

