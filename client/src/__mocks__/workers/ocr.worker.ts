export default class WorkerMock {
    postMessage = jest.fn();
    onmessage = jest.fn();
}