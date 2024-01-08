# canvas-app


## Node Execution Model

### Overview
In our API builder, nodes operate based on a 'solved' model, which differs fundamentally from the execution pin model commonly found in some visual scripting environments. This approach emphasizes data-driven updates and procedural workflows.

### Solved Model Explained
- **Data-Driven**: When a node undergoes a change (e.g., a change in configuration, input, etc.), it 'solves', meaning it processes or recalculates its data based on the change.
- **Downstream Updates**: Upon being solved, the node automatically flags all downstream nodes (i.e., nodes that are directly or indirectly dependent on it) to update their state.
- **Efficient Processing**: Downstream nodes will solve in turn, but only if necessary. This ensures that the entire node network is up-to-date while avoiding unnecessary recalculations.
- **No Execution Pins**: Unlike systems that use execution pins to define the flow of control, our model relies on the natural data dependencies between nodes. This leads to a more intuitive and flexible workflow, especially suited for API development.

### Advantages
- **Intuitive Workflow**: Users can focus on how data flows and is transformed across the API, making it easier to visualize and manage complex logic.
- **Reduced Complexity**: Without the need for explicit control flow management (as in execution pins), the system remains cleaner and more approachable, particularly for users who are not programming experts.
- **Automatic Updates**: The solved mechanism ensures that changes propagate through the network automatically, reducing the risk of outdated or inconsistent data states in the API logic.

### Example
- When a user modifies the URL parameters in a 'URL Parameters Node', this node will solve to reflect the changes. Consequently, the connected 'Endpoint Node' and any other nodes relying on this data will automatically solve, updating the API request structure accordingly.

This solved model aligns with our goal to provide a user-friendly, efficient, and robust tool for API development, catering to both technical and non-technical users.



## MVP Node List

### Endpoint Node
- **Description**: Defines the API endpoint with configurable path and HTTP method (GET, POST, PUT, DELETE).

### Request Data Nodes
- **Header Node**: To specify request headers.
- **URL Parameters Node**: For defining URL query parameters.
- **Body Node**: To create and configure the request body, suitable for different content types like JSON or form data.

### Response Node
- **Description**: Handles the API response, allowing configuration of response status codes, headers, and body content.

### Validation Nodes
- **Description**: Basic validation for incoming data, such as required fields, data types, and format checks (e.g., email format, number ranges).

### Error Handling Node
- **Description**: Manages error responses, allowing users to define custom error messages and status codes for various failure scenarios.

### Data Transformation Node
- **Description**: Provides basic data manipulation capabilities like formatting, conversion between data types, or simple calculations.

### Logic Control Nodes
- **Description**: Basic conditional nodes (e.g., If-Else) to control the flow of the API logic based on certain conditions.

### Logging Node
- **Description**: For basic logging of requests and responses, aiding in debugging and monitoring.

### Execution Control Node
- **Description**: Manages the execution order of nodes, especially important if there are dependencies or conditional flows.

### Authentication Node (Optional)
- **Description**: If your MVP will deal with APIs requiring authentication, a simple node to handle API keys or basic auth can be included.

### Request Nodes
- **Function**: Represents different types of API requests.
- **Configurations**: Users can set up headers, URL parameters, HTTP method, and body content.
- **Multiple Scenarios**: Each node can be configured for different request scenarios, like GET requests with query parameters, POST requests with JSON bodies, etc.

### API Call Node
- **Purpose**: To make external API calls and handle the response.
- **Features**:
  - **URL Configuration**: Users can input the URL of the external API.
  - **Method and Headers**: Allow setting of the HTTP method and headers.
  - **Request Body**: If applicable, users can configure the body of the request.
  - **Response Handling**: Parse and return the response from the external API, including status codes and response data.
- **Use Case**: This node is particularly useful for integrating third-party services, aggregating data from multiple sources, or chaining APIs.

### Active Request Selector (Optional for MVP)
- **Role**: If you're implementing multiple request nodes, provide a mechanism to select which request node is active for testing or conditional execution.


## Publishing Feature

### Overview
The 'Publishing' feature in our API builder is designed to streamline the deployment process of APIs. It automates the generation of code for AWS Lambda functions, deploys them to AWS, and sets up API Gateway to expose the APIs.

### Steps in the Publishing Process

#### 1. Code Generation
- **Automatic Conversion**: When a user decides to publish their API, the builder automatically converts the visual node configuration into executable code suitable for an AWS Lambda function.
- **Language Support**: The initial MVP supports [language preferences], with plans to expand to more languages based on user feedback.

#### 2. Deployment to AWS Lambda
- **Seamless Integration**: The generated code is then deployed to AWS Lambda, creating a new function or updating an existing one.
- **AWS Credentials**: Users must provide their AWS credentials within the builder for this process. These credentials will be used solely for deployment purposes.

#### 3. API Gateway Setup
- **Configuration**: Once the Lambda function is deployed, the builder automatically configures AWS API Gateway to create a new API endpoint or update an existing one, linking it to the Lambda function.
- **Customization**: Users can customize settings like the API endpoint path, HTTP methods, and other relevant configurations during this step.

#### 4. Finalization
- **Deployment Summary**: After successful deployment, the user receives a summary including the API endpoint URL and other relevant details.
- **Error Handling**: In case of any issues during the publishing process, the builder provides detailed error messages to assist in troubleshooting.

### Security and Compliance
- **Best Practices**: The publishing process adheres to AWS's best practices for security and compliance.
- **Data Privacy**: User credentials and data are handled with strict confidentiality and security measures.

### Advantages
- **Simplified Deployment**: This feature significantly simplifies the process of deploying APIs, making it accessible to users with varying levels of technical expertise.
- **Rapid Prototyping to Production**: It enables quick transition from API design to a fully functional, deployed API, ideal for rapid prototyping and agile development.

This feature is part of our commitment to providing a comprehensive, user-friendly solution for API development, from design to deployment.
