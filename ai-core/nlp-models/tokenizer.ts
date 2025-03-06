export function tokenize(text: string): number[] {
    // Simple wordpiece tokenization (replace with actual model tokenizer)
    const vocab = new Map<string, number>();
    // Load your actual vocabulary here
    return text.toLowerCase().split(/\W+/).map(token => vocab.get(token) || 0);
}