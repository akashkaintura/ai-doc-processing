import { renderHook, waitFor, act } from '@testing-library/react';
import { useDocumentProcessor } from '../../../client/src/hooks/useWasm';
import { useWasm } from '../../../client/src/hooks/useWasm';

jest.mock('../../../apps/client/src/hooks/useWasm');

class WorkerMock {
    postMessage = jest.fn();
    onmessage = jest.fn();
}

describe('Document Processing', () => {
    beforeAll(() => {
        (useWasm as jest.Mock).mockReturnValue({
            wasmModule: {
                processImage: jest.fn().mockResolvedValue('Mocked OCR text')
            },
            loading: false,
            error: null
        });
    });

    test('OCR Processing', async () => {
        const file = new File(['test content'], 'test.png', { type: 'image/png' });

        window.Worker = jest.fn().mockImplementation(() => new WorkerMock());

        const { result } = renderHook(() => useDocumentProcessor());

        await act(async () => {
            const analysis = await result.current.processDocument(file);

            await waitFor(() => {
                expect(analysis.entities).toBeInstanceOf(Array);
                expect(analysis.content).toContain('Mocked OCR text');
            });
        });
    });
});