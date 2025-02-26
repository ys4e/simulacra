Files in the `base` directory are not version-specific, and should not be used directly.

These act as the schemas used to generate version-independent `struct`s.
Combined with version-specific serializer/deserializer `trait`s, these can be used to read/write version-specific data.