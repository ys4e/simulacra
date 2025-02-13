# simulacra

Open source, libre mappings for anime game, as well as the tools to generate them.

## Naming

Names used in Simulacra *must be* ***non-proprietary names***, including their inspirations. You **cannot** use existing names as the inspiration for a Simulacra name.

The reason for this rule is because all Simulacra names are *dedicated to the public domain* when they are included in this repository. Without the consent of all parties, one cannot add a name from another person (even if the name was unique, but inspired by someone else!) to the main repository.

The standard convention for naming is `[category/useful group][action/brief descriptor][client/server*][request/response/notify**]`.

- `*` - A two-character notation is used to indicate which end of the connection has to handle the packet.
  - Example: `Cs` means the `Client` is sending a packet to the `server`. (notice the Uppercase/lowercase letters?)
  - Another example: `Sc` means the `Server` is sending a packet to the `client`.
  - This is regardless of packet type. (requests can be sent from the server too!)
- `**` - A three character (except for `Notify`) abbreviation is used for indication the packet type.
  - A request packet, or `Req`, is a request for data from the other end of the connection.
  - A response packet, or `Rsp`, is the formal response containing the data requested in a `Req` packet.
  - A notification packet, or `Notify`, is a packet that can be pushed to the receiver without the need for a formal request/response.

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