export function tokenize(text: string): number[] {
    const vocab = new Map<string, number>();

    return text.toLowerCase().split(/\W+/).map(token => vocab.get(token) || 0);
}