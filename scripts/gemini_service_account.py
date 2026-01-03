"""
使用 Google Cloud 服务账号 JSON 密钥文件调用 Gemini API

这个脚本会：
1. 从 GOOGLE_APPLICATION_CREDENTIALS 环境变量读取 JSON 密钥文件路径
2. 使用服务账号凭证调用 Gemini API
3. 不硬编码任何密钥信息
"""

import os
from google.oauth2 import service_account
import google.generativeai as genai
import google.auth.transport.requests

def setup_gemini_with_service_account():
    """
    使用服务账号 JSON 文件设置 Gemini API
    
    注意：google.generativeai 库主要支持 API Key 认证。
    如果使用服务账号，我们需要先获取访问令牌，然后通过自定义方式使用。
    """
    
    # 1. 从环境变量读取 JSON 密钥文件路径
    credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    if not credentials_path:
        raise ValueError(
            "❌ 错误：未找到 GOOGLE_APPLICATION_CREDENTIALS 环境变量\n\n"
            "请在终端运行以下命令（Mac）：\n"
            'export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/key.json"\n\n'
            "或者参考脚本底部的详细说明。"
        )
    
    if not os.path.exists(credentials_path):
        raise FileNotFoundError(
            f"❌ 错误：找不到密钥文件\n"
            f"路径：{credentials_path}\n"
            "请检查路径是否正确。"
        )
    
    print(f"✓ 找到密钥文件：{credentials_path}")
    
    # 2. 加载服务账号凭证
    credentials = service_account.Credentials.from_service_account_file(
        credentials_path,
        scopes=['https://www.googleapis.com/auth/generative-language']
    )
    
    # 3. 刷新凭证以获取访问令牌
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    
    print("✓ 凭证加载成功")
    
    # 4. 使用访问令牌配置 Gemini
    # 注意：google.generativeai 库可能不完全支持服务账号
    # 这里我们使用令牌作为 API Key（如果支持的话）
    # 如果不行，需要改用 REST API 方式（见下方说明）
    
    # 方法1: 尝试直接使用令牌（某些版本可能支持）
    try:
        # 注意：这种方法可能不适用于所有版本
        # 如果报错，请使用方法2（见下面的 call_gemini_with_rest_api 函数）
        genai.configure(credentials=credentials)
        print("✓ 使用服务账号凭证配置 Gemini")
        return credentials
    except Exception as e:
        print(f"⚠️  直接使用凭证失败: {e}")
        print("将使用 REST API 方式调用...")
        return credentials


def call_gemini_simple(prompt: str):
    """
    使用 google.generativeai 库调用 Gemini（如果支持服务账号）
    """
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise Exception(
            f"调用失败。\n"
            f"错误：{e}\n\n"
            "提示：google.generativeai 库可能不完全支持服务账号。\n"
            "建议使用 call_gemini_with_rest_api 函数（见下方）。"
        )


def call_gemini_with_rest_api(prompt: str, credentials):
    """
    使用 REST API 调用 Gemini（推荐用于服务账号）
    
    如果 google.generativeai 库不支持服务账号，可以使用这个函数。
    """
    import requests
    
    # 刷新令牌
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    access_token = credentials.token
    
    # 调用 Gemini API
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    
    result = response.json()
    return result['candidates'][0]['content']['parts'][0]['text']


def main():
    """主函数：示例用法"""
    
    print("=" * 60)
    print("🚀 使用服务账号调用 Gemini API")
    print("=" * 60)
    print()
    
    # 设置 Gemini
    credentials = setup_gemini_with_service_account()
    
    # 示例提示
    prompt = "请用一句话解释什么是人工智能。"
    
    print(f"\n📝 发送提示：{prompt}")
    print()
    
    # 尝试调用
    try:
        # 先尝试使用 google.generativeai 库（如果支持）
        try:
            response = call_gemini_simple(prompt)
            method = "google.generativeai 库"
        except:
            # 如果不支持，使用 REST API
            response = call_gemini_with_rest_api(prompt, credentials)
            method = "REST API"
        
        print(f"✅ 调用成功（使用 {method}）")
        print("-" * 60)
        print(f"📤 Gemini 的回复：\n\n{response}\n")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ 调用失败：{e}")
        print("\n💡 故障排除建议：")
        print("1. 检查环境变量是否正确设置")
        print("2. 确认密钥文件路径正确")
        print("3. 确认已启用 Generative Language API")
        print("4. 确认服务账号有相应权限")


if __name__ == "__main__":
    main()

