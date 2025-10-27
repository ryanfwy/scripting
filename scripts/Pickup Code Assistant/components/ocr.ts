export async function parseTextFromImage(image: UIImage) {
  const result = await Vision.recognizeText(image, {
    recognitionLevel: 'accurate',
    recognitionLanguages: ['zh-Hans', 'en'],
    usesLanguageCorrection: true
  })
  // console.log('识别到的完整文本：', result.text)
  // for (const block of result.candidates) {
  //   console.log(`文本：${block.content}，置信度：${block.confidence}`)
  // }
  return result.text
}
