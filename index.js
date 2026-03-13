import { marked } from "marked";
import DOMPurify from 'dompurify'

const textAreaInput = document.querySelector(".form-textarea");

async function handleTranslationRequest(e) {
  e.preventDefault();

  const userPrompt = textAreaInput.ariaValueMax.trim();
  if (!userPrompt) {
    return;
  }

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message)
    }

    const translation = data.translation

    const html = marked.parse(translation)

    const safeHTML = DOMPurify.sanitize(html)

    document.querySelector('.result').innerHTML = safeHTML
  } catch (error) {
    console.error(error)
  }
}

document.querySelector('.form-btn').addEventListener('submit', handleTranslationRequest)
