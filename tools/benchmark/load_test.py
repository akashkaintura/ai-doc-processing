import time
from locust import HttpUser, task, between, events
from faker import Faker

class DocumentUser(HttpUser):
    wait_time = between(0.5, 2.5)
    fake = Faker()

    @task
    def process_document(self):
        # Generate realistic test data
        text = self.fake.text(max_nb_chars=5000)  # ~10KB text
        headers = {"Authorization": "Bearer test-token"}
        
        # Test PDF processing
        self.client.post(
            "/api/documents/process",
            json={
                "content": text,
                "mimeType": "application/pdf",
                "originalName": "test-document.pdf"
            },
            headers=headers,
            name="Process PDF"
        )

        # Test image processing
        self.client.post(
            "/api/documents/process",
            json={
                "content": text[:1000],  # Smaller payload
                "mimeType": "image/jpeg",
                "originalName": "test-image.jpg"
            },
            headers=headers,
            name="Process Image"
        )

@events.init_command_line_interface.add_listener
def init_ui(environment):
    """Custom test configuration"""
    environment.parsed_options.headless = True
    environment.parsed_options.spawn_rate = 10
    environment.parsed_options.users = 100
    environment.parsed_options.time_limit = "5m"