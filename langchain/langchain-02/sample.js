const summarizeChain = summarizePrompt | model | parser
const translateChain = translatePrompt | model | parser
const finalChain = summarizeChain | translateChain