#!/usr/bin/env python3
"""
快速测试脚本 - 验证环境变量并调用 Gemini API
"""

import os
import sys

def check_environment():
    """检查环境变量和文件"""
    print("=" * 60)
    print("🔍 检查环境设置")
    print("=" * 60)
    
    # 检查环境变量
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    if not key_path:
        print("\n❌ 环境变量未设置")
        print("\n请在终端运行以下命令（替换成你的实际路径）：")
        print('export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/key.json"')
        print("\n示例：")
        print('export GOOGLE_APPLICATION_CREDENTIALS="/Users/caixiaopi/Downloads/my-key.json"')
        return False
    
    print(f"\n✓ 环境变量已设置")
    print(f"  路径: {key_path}")
    
    # 检查文件是否存在
    if not os.path.exists(key_path):
        print(f"\n❌ 密钥文件不存在")
        print(f"  路径: {key_path}")
        print("\n请检查：")
        print("1. 路径是否正确（包括文件名）")
        print("2. 文件是否存在")
        print("3. 权限是否正确")
        return False
    
    print(f"✓ 密钥文件存在")
    
    # 检查文件格式
    try:
        import json
        with open(key_path, 'r') as f:
            data = json.load(f)
            if 'type' in data and data['type'] == 'service_account':
                print(f"✓ JSON 格式正确（服务账号类型）")
                if 'project_id' in data:
                    print(f"  项目ID: {data['project_id']}")
                return True
            else:
                print(f"⚠️  警告: JSON 文件格式可能不正确")
                return False
    except json.JSONDecodeError:
        print(f"❌ JSON 文件格式错误")
        return False
    except Exception as e:
        print(f"⚠️  读取文件时出错: {e}")
        return True  # 继续尝试
    
    return True


def test_gemini():
    """测试调用 Gemini API"""
    print("\n" + "=" * 60)
    print("🚀 测试调用 Gemini API")
    print("=" * 60)
    
    try:
        from google.oauth2 import service_account
        import google.auth.transport.requests
        import requests
        
        key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        
        print("\n1. 加载服务账号凭证...")
        credentials = service_account.Credentials.from_service_account_file(
            key_path,
            scopes=['https://www.googleapis.com/auth/generative-language']
        )
        print("   ✓ 凭证加载成功")
        
        print("\n2. 获取访问令牌...")
        request = google.auth.transport.requests.Request()
        credentials.refresh(request)
        access_token = credentials.token
        print("   ✓ 令牌获取成功")
        
        print("\n3. 调用 Gemini API...")
        # 使用正确的模型名称（从可用模型列表中选择）
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        print(f"   使用端点: {url}")
        project_id = credentials.project_id if hasattr(credentials, 'project_id') else None
        if project_id:
            print(f"   项目ID: {project_id}")
        payload = {
            "contents": [{
                "parts": [{"text": "请用一句话说'你好'并介绍一下你自己"}]
            }]
        }
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        reply = result['candidates'][0]['content']['parts'][0]['text']
        
        print("   ✓ API 调用成功！\n")
        print("-" * 60)
        print("📤 Gemini 的回复：")
        print("-" * 60)
        print(reply)
        print("=" * 60)
        print("\n✅ 测试成功！你的配置完全正常。")
        return True
        
    except Exception as e:
        print(f"\n❌ 测试失败: {e}")
        print("\n故障排除建议：")
        print("1. 确认已启用 Generative Language API")
        print("   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com")
        print("2. 确认服务账号有相应权限")
        print("3. 检查网络连接")
        return False


def main():
    """主函数"""
    print("\n" + "=" * 60)
    print("🧪 Gemini API 环境测试")
    print("=" * 60)
    
    # 检查环境
    if not check_environment():
        print("\n请先解决上述问题，然后重新运行此脚本。")
        sys.exit(1)
    
    # 测试 API
    if test_gemini():
        print("\n🎉 一切就绪！你现在可以使用 gemini_service_account.py 了。")
    else:
        print("\n请检查错误信息并解决问题。")
        sys.exit(1)


if __name__ == "__main__":
    main()

