
### Intro

What is containerization?

- **Containerization** ensures code runs consistently regardless of where it is deployed.
- TODO: what is a container, and what is a container image?
- **Open Container Initiative** (**OCI**) is an open industry standard that defines what a container image is and how it behaves. When people talk about "container images" today, they almost always mean OCI images. OCI specifies three things: 
	- the image format (how a container image is structured)
	- the distribution (how images are pushed and pulled from registries).
	- the runtime (how a container is actually executed)

### Core Ideas

What are the core ideas behind the structure laid out in the next sections?

- A **digest** is a SHA-256 hash of a piece of content. This content can be anything, and the hash provides the guarantee that if the content changes, the hash also changes. This ensures the SHA-256 hash may serve as a unique identifier.
- TODO: explain Content addressable storage
- TODO: explain that components form a **Merkle DAG**, which is a directed acyclic graph (DAG) where each node has an identifier, and this identifier is the result of hashing the node's contents.
- TODO: explain that this combination ensures immutability, and efficiency since components need to only be stored once.

### Image Specification

How are container images structured?

- Image filesystems are composed of **layers**. Each layer represents a set of filesystem changes (additions, modifications, or deletions) relative to its parent layer. 
	- Breaking an image into layers allows multiple images to share common dependencies, drastically reducing storage and bandwidth requirements.
	- Layers are stored as individual, content-addressable blobs. They are packaged as tar archives and are often compressed using algorithms like gzip or zstd.
- The **Image Configuration** is a JSON document detailing the execution parameters for the container, acting as a set of defaults when the container runs. It includes the entrypoint, environment variables, working directories, networking ports, and an ordered list of hashes for the uncompressed layers.
- An OCI **Image** is defined exactly as an ordered collection of root filesystem changes (the layers) and the corresponding execution parameters (the configuration) intended for use within a container runtime.
- TODO: explain that the identifier of an image is the configuration digest.

### Distribution Specification 

How are container images distributed?

- A **container registry** is a server that stores and distributes OCI images. Registries implement the OCI Distribution specification, so any compliant client can push and pull from them using a standard HTTP API.
- **Repositories** are namespaces within a registry that group related images. A repository typically corresponds to a single application or service.
- TODO: explain image manifests, and the use of manifest digests to identify images.
- **Tags** are mutable, human-readable pointers to a specific manifest within a repository. Because tags are mutable, the same tag may point to a different image at a different time. For the sake of reproducibility, people generally pin images by manifest digest rather than by tag in production.
- **Pushing an Image**: Uploading an image to a registry happens from the bottom up. A client first pushes the large data blobs, the filesystem layers and the image configuration. Once all the blobs are securely uploaded, the client pushes the manifest, which references those components by their digests.
- **Pulling an Image**: Pulling operates in the exact opposite order. A client requests the manifest by its tag or digest. After reading the manifest, the client uses the provided digests to download the image configuration and the individual layer blobs required to assemble the filesystem.
- **Layer Caching and Deduplication**: Because images are built on content-addressable storage, registries can easily deduplicate data. If two different build processes produce the exact same layer, the computed digests will match. The registry only needs to store one copy of that layer. During a push operation, a client can entirely skip uploading a blob if the registry indicates it already possesses a blob with that digest.

### Building Images

How are container images built?

- TODO: explain how images are built
- TODO: explain how builds are sped up using caching, and why order of instruction matters.

### Runtime Specification

How are container images executed?

- The **runtime specification** dictates how an OCI-compliant runtime takes an unpacked image and translates it into a running process on the host operating system. 
- TODO: fill in this section

