# simulacra

Open source, libre mappings for anime game, as well as the tools to generate them.

## Matchers

A matcher is just a CommonJS JavaScript script that is run in an isolated sandbox.

A matcher **must** contain the following methods:
- `init` - `void` return type; called once when the script loads
- `compare` - `void` return type; called when any packet is received.
  - This method takes three parameters: `id: number`, `header: SerializedMessage`, `data: SerializedMessage`

Type annotations are put in comments for use by IDEs (such as WebStorm). They can be found in the [TypeScript definitions](https://github.com/ys4e/biscuit/blob/master/biscuit.d.ts) file located in the Biscuit repository.

### Template

```javascript
/**
 * @return void
 */
function init() {
    info("Loaded my custom matching script!");
}

/**
 * @param id {number}
 * @param header {SerializedMessage}
 * @param data {SerializedMessage}
 * @return void
 */
function compare(id, header, data) {
    // Write your comparison code here!
}
```

---

Most of this project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

All code in the `definitions` folder is licensed under the CC0 license. See the [LICENSE](definitions/LICENSE) file for details.