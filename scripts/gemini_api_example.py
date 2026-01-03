"""
使用 Google Cloud 服务账号密钥调用 Gemini API 的完整示例脚本

使用方法：
1. 设置环境变量 GOOGLE_APPLICATION_CREDENTIALS 指向你的 JSON 密钥文件路径
2. 运行: python scripts/gemini_api_example.py

环境变量设置方式：
- macOS/Linux: export GOOGLE_APPLICATION_CREDENTIALS="/path/to/key.json"
- Windows: set GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\key.json"
- 或使用 .env 文件（推荐）
"""

import os
import json
from typing import Optional
from google.oauth2 import service_account
import google.generativeai as genai
import google.auth
import google.auth.transport.requests

def load_credentials():
    """
    从环境变量加载服务账号密钥
    
    优先顺序：
    1. GOOGLE_APPLICATION_CREDENTIALS (标准环境变量，指向 JSON 文件路径) - 推荐
    2. GOOGLE_SERVICE_ACCOUNT_KEY (自定义环境变量，指向 JSON 文件路径)
    3. GOOGLE_SERVICE_ACCOUNT_JSON (环境变量，直接包含 JSON 字符串)
    
    Returns:
        google.oauth2.service_account.Credentials: 服务账号凭证对象
    """
    # 方法1: 从文件路径加载（推荐）
    credentials_path = (
        os.getenv('GOOGLE_APPLICATION_CREDENTIALS') 
        or os.getenv('GOOGLE_SERVICE_ACCOUNT_KEY')
    )
    
    if credentials_path and os.path.exists(credentials_path):
        print(f"✓ 从文件加载凭证: {credentials_path}")
        credentials = service_account.Credentials.from_service_account_file(
            credentials_path,
            scopes=[
                'https://www.googleapis.com/auth/generative-language',
                'https://www.googleapis.com/auth/cloud-platform'
            ]
        )
        return credentials
    
    # 方法2: 从环境变量中的 JSON 字符串加载
    json_str = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON')
    if json_str:
        print("✓ 从环境变量加载凭证")
        try:
            service_account_info = json.loads(json_str)
            credentials = service_account.Credentials.from_service_account_info(
                service_account_info,
                scopes=[
                    'https://www.googleapis.com/auth/generative-language',
                    'https://www.googleapis.com/auth/cloud-platform'
                ]
            )
            return credentials
        except json.JSONDecodeError as e:
            raise ValueError(f"环境变量中的 JSON 格式无效: {e}")
    
    # 方法3: 尝试使用默认凭证（如果在 GCP 环境中运行）
    try:
        print("尝试使用默认凭证...")
        credentials, project = google.auth.default(
            scopes=[
                'https://www.googleapis.com/auth/generative-language',
                'https://www.googleapis.com/auth/cloud-platform'
            ]
        )
        if credentials:
            print("✓ 使用默认凭证")
            return credentials
    except Exception:
        pass
    
    raise ValueError(
        "\n❌ 未找到服务账号凭证。请设置以下环境变量之一：\n\n"
        "  📁 方式1（推荐）: GOOGLE_APPLICATION_CREDENTIALS\n"
        "     export GOOGLE_APPLICATION_CREDENTIALS=\"/path/to/service-account-key.json\"\n\n"
        "  📁 方式2: GOOGLE_SERVICE_ACCOUNT_KEY\n"
        "     export GOOGLE_SERVICE_ACCOUNT_KEY=\"/path/to/service-account-key.json\"\n\n"
        "  📄 方式3: GOOGLE_SERVICE_ACCOUNT_JSON\n"
        "     export GOOGLE_SERVICE_ACCOUNT_JSON='{\"type\":\"service_account\",...}'\n\n"
        "💡 提示: 也可以使用 .env 文件来管理环境变量"
    )


def get_access_token(credentials) -> str:
    """
    使用服务账号凭证获取访问令牌
    
    Args:
        credentials: 服务账号凭证对象
    
    Returns:
        str: 访问令牌
    """
    # 刷新凭证以获取访问令牌
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    return credentials.token


def call_gemini_api_with_service_account(
    prompt: str, 
    model_name: str = "gemini-1.5-pro"
) -> str:
    """
    使用服务账号凭证调用 Gemini API
    
    Args:
        prompt: 要发送给模型的提示文本
        model_name: 使用的模型名称，默认为 "gemini-1.5-pro"
    
    Returns:
        str: API 响应内容
    
    Raises:
        ValueError: 如果凭证加载失败
        Exception: 如果 API 调用失败
    """
    try:
        # 加载服务账号凭证
        credentials = load_credentials()
        
        # 获取访问令牌
        access_token = get_access_token(credentials)
        
        # 配置 Gemini API 使用访问令牌
        # 注意: google-generativeai 库可能不完全支持服务账号
        # 这里展示两种方式
        
        print(f"\n🚀 调用 Gemini API (模型: {model_name})...")
        print(f"📝 提示: {prompt[:50]}..." if len(prompt) > 50 else f"📝 提示: {prompt}")
        
        # 方式1: 如果 google-generativeai 支持 OAuth2（某些版本可能不支持）
        # 注意: 当前版本的 google-generativeai 主要支持 API Key
        # 如果需要使用服务账号，可能需要使用 REST API 直接调用
        
        # 方式2: 使用 REST API 直接调用（更可靠）
        import requests
        
        project_id = credentials.project_id if hasattr(credentials, 'project_id') else None
        if not project_id:
            # 尝试从凭证信息中获取项目ID
            if hasattr(credentials, 'service_account_email'):
                # 从服务账号邮箱推断项目ID（如果格式是 service-account@project-id.iam.gserviceaccount.com）
                email = credentials.service_account_email
                if '@' in email:
                    project_id = email.split('@')[1].split('.')[0]
        
        # Gemini API REST 端点
        # 注意: 实际端点可能因版本而异，请参考最新文档
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
        
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }
        
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        
        # 提取响应文本
        if 'candidates' in result and len(result['candidates']) > 0:
            content = result['candidates'][0]['content']['parts'][0]['text']
            return content
        else:
            raise ValueError(f"API 响应格式异常: {result}")
    
    except requests.exceptions.HTTPError as e:
        error_msg = f"HTTP 错误: {e.response.status_code}"
        if e.response.text:
            try:
                error_detail = json.loads(e.response.text)
                error_msg += f"\n详情: {error_detail.get('error', {}).get('message', e.response.text)}"
            except:
                error_msg += f"\n详情: {e.response.text}"
        raise Exception(error_msg) from e
    except Exception as e:
        print(f"\n❌ 调用 Gemini API 时出错: {e}")
        raise


def call_gemini_api_with_api_key(
    prompt: str, 
    model_name: str = "gemini-1.5-pro"
) -> str:
    """
    使用 API Key 调用 Gemini API（备用方式）
    
    Args:
        prompt: 要发送给模型的提示文本
        model_name: 使用的模型名称
    
    Returns:
        str: API 响应内容
    """
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("未找到 GEMINI_API_KEY 环境变量")
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)
    response = model.generate_content(prompt)
    return response.text


def main():
    """主函数示例"""
    # 示例提示
    prompt = "请用一句话解释什么是人工智能。"
    
    print("=" * 60)
    print("🚀 Gemini API 调用示例 - 使用服务账号")
    print("=" * 60)
    
    # 优先尝试使用服务账号
    try:
        print("\n📋 尝试使用服务账号凭证...")
        response = call_gemini_api_with_service_account(prompt)
        print("\n" + "=" * 60)
        print("✅ 调用成功！")
        print("=" * 60)
        print("\n📤 响应内容:\n")
        print(response)
        print("\n" + "=" * 60)
        
    except Exception as service_account_error:
        print(f"\n⚠️  服务账号方式失败: {service_account_error}")
        
        # 如果服务账号失败，尝试使用 API Key（如果有）
        print("\n📋 尝试使用 API Key...")
        try:
            response = call_gemini_api_with_api_key(prompt)
            print("\n" + "=" * 60)
            print("✅ 使用 API Key 调用成功！")
            print("=" * 60)
            print("\n📤 响应内容:\n")
            print(response)
            print("\n" + "=" * 60)
        except Exception as api_key_error:
            print(f"\n❌ API Key 方式也失败: {api_key_error}")
            print("\n" + "=" * 60)
            print("🔍 故障排除建议:")
            print("=" * 60)
            print("\n1. ✅ 检查环境变量是否正确设置:")
            print("   export GOOGLE_APPLICATION_CREDENTIALS=\"/path/to/key.json\"")
            print("\n2. ✅ 确认 JSON 密钥文件路径是否正确且文件存在")
            print("\n3. ✅ 检查是否已启用 Generative Language API:")
            print("   https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com")
            print("\n4. ✅ 确认服务账号有相应权限:")
            print("   - Generative Language User 角色")
            print("   - 或自定义角色包含必要的权限")
            print("\n5. ✅ 验证服务账号邮箱格式正确")
            print("\n6. ✅ 如果是首次使用，可能需要等待几分钟让权限生效")
            print("\n💡 提示: 也可以使用 API Key 作为备用方式")
            print("   export GEMINI_API_KEY=\"your-api-key\"")


if __name__ == "__main__":
    main()

