The following is a simple guideline to using FastAPI.

### What is FastAPI?

To understand FastAPI, it is essential to first understand the two independent, foundational libraries it is built upon: Pydantic and Starlette.

- Pydantic is a high-performance data validation and JSON (de)serialization engine for Python that relies entirely on standard type hints. It optionally handles type coercion, and generates detailed errors for malformed data, ensuring all incoming and outgoing data is strictly compliant and efficiently processed. 
- Starlette is a lightweight, high-performance ASGI (Asynchronous Server Gateway Interface) framework/toolkit. It serves as the underlying web engine, handling the network protocols, routing, asynchronous concurrency, the request/response cycle, and WebSockets.
- FastAPI is the API framework that combines Starlette's web capabilities with Pydantic's data validation, while adding its own developer-experience enhancements. Such as a dependency injection system and automatic generation of interactive OpenAPI (Swagger) documentation directly from your Python type hints.

### FastAPI Guidelines

To keep your FastAPI applications clean, maintainable, and performant, follow these core development guidelines.

**1. Be Explicit with Parameter Sources**: FastAPI can often guess where a parameter comes from based on its type or name. However, relying on implicit behavior can lead to confusion. Always use explicit type hints and declare exactly where a parameter should be extracted from using `Annotated` from `typing`, and FastAPI's types like `Path`, `Query`, `Body`, and `Header`. This makes your code self-documenting and prevents unexpected parsing behavior.

**2. Use Native Type Hints for Responses**: Prefer Python's native return type hints (e.g., `async def get_object() -> ExampleModel:`) instead of passing the `response_model` argument into the route decorator. Native type hints allow your IDE to accurately type-check what your function actually returns, is more explicit, and keeps the route decorator uncluttered. 

When returning objects like database models, explicitly convert them into your Pydantic schemas before returning:
```python
return ExampleModel.model_validate(obj, from_attributes=True)
```

**3. Adopt Pydantic v2 Syntax**: FastAPI fully supports Pydantic v2, which offers massive performance improvements and a cleaner API. Always use the modern, future-proof syntax over older v1 methods:
- Use `.model_validate()` instead of the legacy `.from_orm()`.
- Use `.model_dump()` instead of `.dict()`.
- Use `model_config = ConfigDict(...)` at the class level instead of the nested `class Config:` block for model configuration.

**4. Leverage Dependency Injection (Depends)**: It is likely that many endpoints will require the same setup and teardown of the same resources. FastAPI's dependency injection allows you to define these operations once, and inject them into your endpoints using `Depends()`. For testing, you can modify the dependencies that are injected by using the built-in `app.dependency_overrides`, instead of using error-prone patching.

**5. Dont block the Async event loop**: If you define an endpoint with `async def`, you must ensure that no synchronous, blocking operations (like heavy CPU computations, large file processing, or synchronous API requests) occur within it, as it will freeze the API for all users.
- If you must execute blocking code, define your endpoint as a standard def. FastAPI will automatically run it in a separate thread pool.
- If you need to perform heavy background work after returning a response, delegate that work to FastAPI's `BackgroundTasks` or an external task queue like Celery.

**6. Use Lifespan** For resources that need to be set up and torn down along with the FastAPI app, you should use the `lifespan` parameter on the FastAPI application instance. By defining these tasks within a lifespan context manager, they share the exact same event loop as the rest of the application. This allows you to execute asynchronous teardown operations smoothly, which is not possible using standard libraries like `atexit`.

### Request and Response

One of FastAPI's biggest advantages is its automatic data validation and documentation generation via Pydantic. When you return a raw `Response` object or read directly from a raw `Request`, you bypass FastAPI's automated translation layer, losing these advantages. Therefore, it is generally not recommended to interact with the raw Request and Response objects directly. 

However, there are specific scenarios where accessing the underlying ASGI request or response is necessary. Such scenarios include but are not limited to:

- **Client Connection Metadata**: When you need network-level information about the incoming connection. This includes accessing the user's IP address (`request.client.host`) for rate-limiting or security logging, or reading the requested URL (`request.base_url`) to dynamically construct absolute links in your response.
- **Middleware State Access**: FastAPI provides `request.state` as a designated space to safely pass contextual data between your middleware and your endpoints.
- **Empty Bodies (HTTP 204):** When an endpoint has no data to return (e.g., a successful `DELETE` operation), you must return a bare response (e.g. `Response(status_code=status.HTTP_204_NO_CONTENT)`) to prevent FastAPI from trying to serialize a `null` body.    
- **Cookie Management:** When you need to set or delete HTTP-only cookies, such as session tokens during a `/login` or `/logout` flow. You inject `response: Response` into the route parameters to access `response.set_cookie()`, but return the pydantic object as normal.
- **Non-JSON Media:** When you are returning files, streaming data, or outputting custom content types like PDFs, CSVs, or raw HTML (using specific subclasses like `FileResponse`, `StreamingResponse`, or `HTMLResponse`).
- **Dynamic Headers:** When you need to conditionally inject custom HTTP headers into the response based on the request's outcome.

> **Note on Status Code Duplication:** When returning a raw `Response` you must explicitly state the status code in *both* the route decorator and the `Response` object. The decorator tells the *OpenAPI documentation* what to expect. The return statement tells the *FastAPI server* how to execute the response so it doesn't default back to a `200 OK`. Explicitly writing both ensures your documentation perfectly matches your server behavior. Example:
> 
> ```python
> @router.delete("/items/{id}", status_code=status.HTTP_204_NO_CONTENT)
> async def delete_item(id: str) -> Response:
>     return Response(status_code=status.HTTP_204_NO_CONTENT)
> ```

### Error Handling

To keep your endpoint logic clean, you should never return error responses directly. Instead, raise an exception and let FastAPI's centralized exception handlers format and return the HTTP response.

By default, FastAPI handles errors automatically across three main categories:
- **Request Validation Errors**: When incoming data fails Pydantic's schema validation, FastAPI intercepts the error (as a `RequestValidationError`) and automatically returns a `422 Unprocessable Entity`. The response body contains a detailed, machine-readable JSON array pointing out exactly which fields failed and why.
- **HTTPExceptions**: When you encounter a known error state in your logic (e.g., a requested item does not exist), you raise `HTTPException(status_code=404, detail="Not found")`. FastAPI catches this and translates it into the appropriate HTTP response, embedding your custom detail message.
- **Server (Uncaught) Errors**: Any standard Python exception that goes unhandled within your application is caught automatically. FastAPI safely returns a generic `500 Internal Server Error` to the client, preventing internal stack traces or sensitive environment data from leaking into the public response.

You can customize how errors are formatted by using the `@app.exception_handler()` decorator. This is useful for standardizing error payloads across your entire API. When registering multiple exception handlers, FastAPI automatically routes the error to the handler registered for the most specific (least general) exception class in the Python inheritance tree.

### Logging

TODO: write about how logging should be handled.

### Rate Limiting

TODO: write about how rate limiting should be handled.

### Cross-Site Request Forgery (CSRF)

TODO: write about how session authentication for a frontend should be handled.

### Pydantic Settings

The `pydantic-settings` package allows you to manage your project config and environment variables using Pydantic models. It automatically reads from environment variables or `.env` files, performs type validation, and can parse strings into native Python types (like converting "true" to a boolean or "1,2,3" to a list).

**Pitfall 1**: creating a single, massive `Settings` class that loads every environment variable your entire application could possibly need. 

Instead, break config down into modular cohesive settings classes based on where they are used. For example, have separate classes for `DatabaseSettings`, `RedisSettings`, and `AuthSettings`. This allows scripts to use the same resources as the FastAPI app, but not require ALL the secrets.

**Pitfall 2**: initializing settings as global variables at the module level. If you do this, the environment variables are read and validated the moment the file is imported. This leads to crashes when these variables dont exist, even if the specific code being executed doesn't require them.

Instead, wrap the instantiation of your settings with a function. To maintain performance and prevent the app from re-reading the environment variables on every call of this method, decorate this function with Python's built-in `@lru_cache`. 

> Pitfall 1 and 2 can be effectively summarized as "load only what is necessary, and only when its necessary".

### Long-Lived Dependencies

To determine the appropriate approach, we start by stating our core assumption. **By Long-Lived dependencies, we are referring to dependencies that are initialized once, and are then expected to remain the same throughout the lifetime of the app or script, and would only ever be updated during runtime for the sake of tests**. 

The most common ways to use settings (constants) in functions are as follows:
1. **Direct access**: the function retrieves its dependencies itself. This keeps the function signatures simple, but causes the dependencies to be baked into the function, forcing you to use patching (and to reset caches) for tests. This also breaks when multiple threads want to rely on different values for the same global variables, such as during parallelized testing.
2. **Dependency Injection**: we inject the dependencies into the function. This is naturally supported by FastAPI's automatic dependency injection via `Depends()`. A downside of this approach is that this may lead to parameter bloat, or prop drilling, which is the tedious process of passing the injected settings down through many function calls.
3. **Service Classes**: we create a service class that accepts the settings in its constructor, and allows its methods to access the settings via `self.settings.*`, or some variant thereof. You then inject an instance of this service class into any of the methods that rely on it. You may also create a cached getter for the instance of the service class that relies on the default settings. 

In general, Option 1 is rarely a good idea, as the baked in settings will make testing very difficult.

Option 2 and 3 essentially only vary by notation, as both benefit from dependency injection, making this decision largely a matter of personal preference. 
- Option 2, passes the dependency to every function that needs it (`method(dependency, params)`)
- Option 3, passes the dependency to a constructor once (`service = Service(dependency)`), and calls methods on the resulting object many times (`service.method(params)`).

### Services

Now that we have established the API layer we need a place to write the actual business logic of the application. 

A common pitfall in web development is writing complex logic directly inside the route definition. Instead, your endpoints should remain as thin as possible. An endpoint's only responsibilities should be receiving the validated request, delegating the work to a specialized function, and returning the formatted response. Everything else must be separated into dedicated "services." 

Services should operate on standard data structures, ORM models, or Pydantic schemas. They should never import or interact with FastAPI-specific objects like Request, Response, or Depends.

Separating your logic in this way provides three major benefits:
- **Reusability**: You can call the exact same service function from a FastAPI endpoint, a background task queue (like Celery), or a CLI command without rewriting or duplicating the logic.
- **Testability**: You can unit-test your core business logic directly using standard Python testing tools, without needing to mock HTTP requests or a FastAPI TestClient.
- **Maintainability**: If your API layer needs to change, or if you migrate to a different web framework entirely, your core application logic remains completely untouched.

Because services should not know about HTTP, they should never raise FastAPI's `HTTPException` natively. Instead, raise custom, domain-specific Python exceptions (e.g., `UserNotFoundError` or `InsufficientFundsError`). You can then use FastAPI's `@app.exception_handler()` to automatically catch these domain errors at the API layer and translate them into the appropriate HTTP response codes.

### Database and ORM

One of the most common services in any web application is interacting with a database. To interact with a database in Python, developers typically use an Object-Relational Mapping (ORM). An ORM is a library that translates Python classes and objects into relational database tables and rows.

While it is possible to write raw SQL queries directly, utilizing an ORM provides several major advantages:
- **Security**: ORMs automatically parameterize queries, protecting your application from SQL injection attacks.
- **Developer Experience**: Instead of writing raw SQL strings, you interact with your database using standard Python methods. This allows your IDE to provide auto-completion and type-checking, catching errors before runtime.
- **Maintainability and Portability**: ORMs abstract away the specific SQL dialect. This makes refactoring easier and allows you to switch underlying database engines with minimal code changes.

For FastAPI applications, SQLAlchemy is the industry standard ORM. It is widely used, can handle complex relational queries, connection pooling, and transaction management. 

However, a traditional pain point when pairing SQLAlchemy with FastAPI is model duplication: having to write an SQLAlchemy model to define the database table, and a nearly identical Pydantic model to validate the incoming API request. To solve this, the author of FastAPI created SQLModel, which allows you to define a single Python class that functions as both a Pydantic schema and an SQLAlchemy model for the database.

### Migrations

As your application evolves, your database structure will inevitably change. Modifying a live production database manually is dangerous, difficult to track, and can easily break your application. To manage these schema changes safely, we use migrations. A migration is a version-controlled script that systematically applies (or rolls back) structural changes to your database schema.

The standard tool for handling this in the SQLAlchemy ecosystem is Alembic. Rather than forcing you to write every migration script entirely by hand, Alembic can largely automate the process. It works by inspecting your current Python models and comparing them against the current structure of the database. Alembic diffs the two states and automatically generates a migration script containing the exact operations needed to safely bridge the gap.

### Admin

As your application grows, developers should not be the only ones capable of reading or modifying the database. An admin panel provides a protected graphical user interface (GUI) to manage your application's underlying data and configurations.

Benefits include:
- **Non-Technical Operations:** It supports non-technical teams to handle routine tasks, such as updating user permissions, correcting data entry errors, or reviewing flagged content, without requiring custom API endpoints or asking developers to run raw SQL queries.
- **Easy Debugging:** It gives developers a quick, visual way to inspect database states during development. Instead of executing manual queries to verify if an API route behaved correctly, you can visually confirm the results in the admin dashboard.
- **Security and Isolation:** It provides a centralized space for sensitive data operations, ensuring administrative capabilities are cleanly separated from your public-facing business logic.

Libraries like **`sqladmin`** and **`fastapi-admin`** integrate natively with SQLAlchemy and SQLModel. These tools read your existing database models and automatically generate full-featured CRUD (Create, Read, Update, Delete) interfaces with minimal configuration, preventing you from having to build and maintain internal tooling from scratch.

### Commands

While the FastAPI server handles incoming HTTP requests, it is rarely the only way you will need to interact with your application's logic. You will often require alternative entry points to execute scheduled cron jobs, perform database maintenance, trigger manual data synchronizations, or create an initial admin user. Starting the entire web server to perform these automated or one-off tasks is inefficient.

The cleanest way to handle these scenarios is to build a simple Command Line Interface (CLI). The standard and recommended tool for building CLIs in the FastAPI ecosystem is Typer. Typer uses native Python type hints to automatically parse arguments, validate inputs, and generate `--help` documentation. Because we abstracted the core business logic away from the API routing layer (as discussed in the Services section), your CLI commands remain incredibly simple.

Because CLI commands run outside of the FastAPI application instance, they do not use the application's lifespan context manager. To prevent dangling database connections or hanging background threads, you must handle resource teardown within your command logic.

### Project Structure

FastAPI does not enforce a specific project layout. While this flexibility allows you to build a microservice in a single file, it can lead to disorganized and unmaintainable code as an application grows.

To keep your codebase predictable and aligned with the separation of concerns discussed in the previous sections, it is highly recommended to adopt a structured, modular layout. A an example project structure for a medium FastAPI application looks like this:

```plaintext
my_project/
├── alembic/                # Database migration scripts generated by Alembic
├── app/                    # The main application code
│   ├── api/                # Route definitions and endpoints (FastAPI routers)
│   │   ├── dependencies.py # Reusable FastAPI Depends() functions
│   │   └── v1/             # API versioning (e.g., users.py, items.py)
│   ├── commands/           # Typer CLI scripts and manual execution tasks
│   ├── models/             # Database tables (SQLModel or SQLAlchemy models)
│   ├── schemas/            # Pydantic models for Request/Response validation 
│   ├── services/           # Core business logic separated from HTTP context
│   └── main.py             # FastAPI application instance and lifespan setup
├── tests/                  # Pytest test suite
├── alembic.ini             # Alembic configuration file
├── requirements.txt        # Project dependencies
└── .env                    # Environment variables (never committed to version control)
```

Note this is one of the most subjective components of this guideline. In general, any structure that is logical, consistent, and allows for loose coupling and high cohesion is a good idea.

### Deployment

FastAPI is a web framework, not a web server. It defines how your application behaves, how routes are structured, and how data is validated, but it does not know how to listen to a network port, accept incoming TCP connections, or manage raw HTTP traffic. To bridge this gap and run your application, you must use an ASGI (Asynchronous Server Gateway Interface) server.

To handle this in production, deployments typically rely on the following two packages working together:
- Uvicorn: The standard ASGI server recommended by the FastAPI documentation. Uvicorn is responsible for handling the actual network connections.
- Gunicorn: is a process manager that allows you to start and manage multiple Uvicorn "worker" processes in parallel. If a worker dies, Gunicorn automatically restarts it, ensuring your application remains highly available, resilient, and capable of utilizing multiple CPU cores.