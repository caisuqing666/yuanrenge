"""
简化版：使用 Google Cloud 服务账号调用 Gemini API

这是一个更简洁的示例，展示最基本的使用方法。

快速开始：
1. 设置环境变量: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
2. 运行: python scripts/gemini_simple_example.py
"""

import os
import json
import requests
from google.oauth2 import service_account
import google.auth.transport.requests

def get_credentials():
    """
    从环境变量加载服务账号凭证
    
    支持的环境变量：
    - GOOGLE_APPLICATION_CREDENTIALS: JSON 密钥文件路径（推荐）
    - GOOGLE_SERVICE_ACCOUNT_KEY: JSON 密钥文件路径（备选）
    """
    # 方式1: 从文件路径加载
    key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS') or os.getenv('GOOGLE_SERVICE_ACCOUNT_KEY')
    
    if key_path and os.path.exists(key_path):
        print(f"✓ 加载凭证文件: {key_path}")
        return service_account.Credentials.from_service_account_file(
            key_path,
            scopes=['https://www.googleapis.com/auth/generative-language']
        )
    
    # 方式2: 从环境变量中的 JSON 字符串加载
    json_str = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
    if json_str:
        print("✓ 从环境变量加载凭证")
        return service_account.Credentials.from_service_account_info(
            json.loads(json_str),
            scopes=['https://www.googleapis.com/auth/generative-language']
        )
    
    raise ValueError(
        "❌ 未找到服务账号凭证。请设置环境变量：\n"
        "export GOOGLE_APPLICATION_CREDENTIALS=\"/path/to/key.json\""
    )


def call_gemini(prompt: str, model: str = "gemini-1.5-pro") -> str:
    """
    调用 Gemini API
    
    Args:
        prompt: 提示文本
        model: 模型名称，默认为 gemini-1.5-pro
    
    Returns:
        API 响应文本
    """
    # 加载凭证并获取访问令牌
    credentials = get_credentials()
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    access_token = credentials.token
    
    # 调用 Gemini API
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    
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


if __name__ == "__main__":
    # 示例使用
    try:
        prompt = "请用一句话解释什么是机器学习。"
        print(f"📝 提示: {prompt}\n")
        
        response = call_gemini(prompt)
        print(f"✅ 响应:\n{response}\n")
        
    except Exception as e:
        print(f"❌ 错误: {e}")

