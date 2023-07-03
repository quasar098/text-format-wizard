# tags

## what are tags?

tags are used in module arguments and they get replaced during processing of the recipe.

example:

![image](https://user-images.githubusercontent.com/70716985/230640677-5ea8e6a2-e693-41d4-8e1f-68bc1cde5b69.png)

in this example, a number from 1 to 5 (inclusive) will be appended

some tags are global, like `%rand%`, but some are specific to modules, like the Keep Regex `%original%`

## all global tags

### `%rand%`

- `%rand%` - random bit (0 or 1)
- `%rand()` - alias for `%rand%`
- `%rand(max)%` - number from 0 to max, inclusive of both
- `%rand(min, max)%` - number from min to max, inclusive of both

### `%choose%`

- `%choose(chars)%` - choose random character from chars

### `%v%`

- `%v<name>%` - this tag gets replaced by the value stored in the register at `<name>`
