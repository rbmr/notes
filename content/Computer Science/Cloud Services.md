
### Client-Server Model

**Centralized Applications** are applications where all components that require it to function are on a single device. Examples include text editors, file explorer, and single player video games. **Distributed Applications** are systems for which components are distributed across different computers. Most applications fall under this category. These include, social media apps, all web pages, and all multi player video games.

The **Client-Server Model** is an architecture for distributed applications, where tasks are divided between the providers of a resource or service (called **servers**) and those that use it (called **clients**). **Server-side** and **Client-side** then refer to the operations performed on the side of the server and client respectively.

In most distributed applications, there are multiple servers, and multiple clients, communicating in different ways. As a consequence, the division into client and server becomes a matter of perspective. Take for example the following web app architecture: at the top level we have multiple different users, making requests to a static web page server, which in turn makes requests to an API providing the business logic, which finally make requests to a database to retrieve the data. From the perspective of the database, the API is the client, from the perspective of the API, the static web page server is the client, from the static web page server the end-user is the client. Looking at an application overall, we generally refer to the end-user as the client. 

### Execution Lifecycles

- Always-On: These are long-lived processes that stay active indefinitely.
    - Used for: Backends, Frontends, and real-time streaming ETLs.
- Long-Running: These are heavy-duty tasks that might take minutes or hours to complete. Unlike "Always-On" services, they have a definitive start and end point.
    - Used for: Training ML Models, nightly ETL pipelines, or generating monthly reports.
- Short-Running: These are simple tasks that that take very little time to complete.
    - Used for: Sending a single email, processing an uploaded file, or a quick data validation check.

### Execution Triggers

Trigger Type | Description | Example
-- | -- | --
Manual | Initiated directly by a human developer. | Clicking "Run Pipeline" in a UI or using a CLI command.
Schedule (Cron) | Triggered at specific time intervals. | Running a backup every night at 2:00 AM.
Webhooks | Triggered by a call to an endpoint. | A payment confirmation triggers an "Order Fulfillment" task.
Event-Driven | Triggered by an event occuring. | A pipeline starts processing the moment a new file is uploaded.
Continuous | The process restarts itself immediately if it ever stops. | A frontend server restarting after a crash.







The hierarchy of the cloud is as follows:
1. Individual Machines
2. Racks: Groups of machines sharing a power supply and a "Top of Rack" (ToR) network switch.
3. Clusters: Multiple racks connected via high-speed backplanes.
4. Data Centers: Dedicated Buildings housing multiple clusters with independent cooling and power.
5. Regions: Geographic areas containing multiple data centers (Availability Zones) connected by low-latency fiber.
6. The Cloud: The global network of all regions interconnected to provide worldwide service.




- How a data center is built and scaled, from the individual machines, to racks, to clusters, to data centers, to regions, to the cloud as a whole.
- Degrees of control
	- Self-Hosting, 
	- Directly access machines in the cloud, 
	- virtual machines (multiple machines in a single machine, consequently the "machine" is independent of the actual machine and can therefore be scaled)
	- serverlessness (only provide code, completely forget the machine)
- Scalability (Horizontal, Vertical, Autoscaling)
- Execution Life-cycles (Always-on, Long-running, Short-running)
- Execution Triggers (Manual, Schedule (Cron), Webhooks/API (Request-Response), Event-driven, Continuous)
- Infrastructure as Code (IaC)
- Container Orchestration
- Availability: how likely is an outage to lead to unavailability?
- Durability: how likely are we to lose data?
- Virtual Networks