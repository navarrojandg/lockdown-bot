# lockdown-bot
 
## Usage
`<command> <tags>...`

Command | Description | DM | Text | Example
------- | ----------- | -- | ---- | -------
!lockdown | Lockdown the server, preventing certain specified roles from sending messages or joining voice channels. | ❌ | ✅ | `!lockdown -r role` 
!ping | Quickly check if lockdown bot is online | ✅ | ❌ | `!ping`

Short tag | Full Tag | Default
--------- | -------- | -------
`-r`      | `--role`  | `@everyone`

### Locking a single role
Without specifying a role, lockdown-bot will automatically lock the `@everyone` role.
`!lockdown -r section1` or `!lockdown --role=section1` will lock down the role with name `section1`.

Use the full tag and quotes when specifying roles names with spaces.
`!lockdown --role="section 2"` will lock down the role with the name `section 2`.

### Locking multiple roles
Use `-r` or `--role` for each role to be locked.
`!lockdown -r section3 -r section4 --role=section5 --role="section 6"`
