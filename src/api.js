/**
 * GPT API 호출을 위한 유틸리티 함수
 * .env 파일에서 VITE_OPENAI_API_KEY를 불러와서 사용합니다.
 */

// .env에서 API Key 불러오기
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * API Key 유효성 검사
 */
function validateApiKey() {
    if (!API_KEY || API_KEY === 'your-api-key-here') {
        throw new Error('API Key가 설정되지 않았습니다. .env 파일에 VITE_OPENAI_API_KEY를 설정해주세요.');
    }
    return API_KEY;
}

/**
 * 이미지 분석 (GPT-4o Vision)
 * @param {string} base64Image - Base64로 인코딩된 이미지 데이터
 * @returns {Promise<Object>} 분석 결과
 */
export async function analyzeImageWithGPT(base64Image) {
    validateApiKey();
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "당신은 특수교육 전문가입니다. 교과서 이미지를 분석하여 1) 학습 목표와 관련된 핵심 개념 3가지를 추출하고, 2) 각 개념에 해당하는 '점자(Unicode 텍스트)'와 3) '수어 동작에 대한 묘사'를 JSON 형식으로 정리해 주세요. 형식: {\"concepts\": [{\"concept\": \"단어\", \"braille\": \"점자\", \"sign_desc\": \"수어설명\"}, ...]}"
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "이 교과서 이미지에서 중요한 개념을 뽑아서 점자와 수어 설명과 함께 알려줘." },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                    ]
                }
            ],
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
    }

    const content = JSON.parse(data.choices[0].message.content);
    return content;
}

/**
 * 챗봇 메시지 전송 (GPT-4o)
 * @param {string} userMessage - 사용자 메시지
 * @param {string} context - 이전 이미지 분석 내용 (선택사항)
 * @returns {Promise<string>} 봇 응답
 */
export async function sendChatMessage(userMessage, context = "") {
    validateApiKey();

    const messages = [
        { 
            role: "system", 
            content: "당신은 친절한 특수교사입니다. 학생의 질문에 쉽게 설명해주고, 앞서 분석한 교과서 내용이 있다면 그것을 바탕으로 대답하세요." 
        }
    ];

    if (context) {
        messages.push({
            role: "system",
            content: context
        });
    }

    messages.push({
        role: "user",
        content: userMessage
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${API_KEY}` 
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: messages
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API 응답 형식이 올바르지 않습니다.');
    }

    return data.choices[0].message.content;
}

