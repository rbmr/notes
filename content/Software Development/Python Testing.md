### Intro

TODO
- define test in a single sentence. 
- state that tests can show the presence but not absence of bugs (dijkstra)
- the general anatomy of a test (reference: https://docs.pytest.org/en/stable/explanation/anatomy.html)

### Pytest

- state that pytest is preferable over unittest (and why)
- basics: fixtures and parameterization, markers

### Guidelines for Testing

- the test should be (significantly) easier to understand than the code under test, quote "Production code is allowed to be clever (if performance or business logic demands it). Test code should be boring."
- dont put your test code in your production code https://how-to-build-high-quality-software.com/do-not-clutter-production-code-with-test-code/
- explain flaky tests, why they are bad, and common causes and fixes

### Mocking

- explain mocking/patching, etc. Explain the debate between to mock or not to mock. State the middle ground. Also explain cassettes as a good option to test against a real API without actually hitting the API every time. Add a small note that it is important to carefully obfuscate these cassettes if they contain sensitive info before committing them to version control. 

### Further Reading

This note is kept short deliberately to put emphasis on topics that are actually commonly used in practice.

Other interesting test topics include:
- property based testing 
- mutation testing
- code coverage statistics
