from locust import HttpUser, task, between

class DocumentProcessingUser(HttpUser):
    wait_time = between(1, 5)
    
    @task
    def process_document(self):
        sample_text = "Lorem ipsum " * 1000  # 10KB sample
        headers = {"Authorization": "Bearer test"}
        self.client.post(
            "/api/process",
            json={"content": sample_text, "mimeType": "text/plain"},
            headers=headers
        )