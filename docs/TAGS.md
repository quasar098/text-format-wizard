# tags

## what are tags?

tags are used in module arguments and they get replaced during processing of the recipe.

example:

*todo put example here*

some tags are global, like `%rand%`, but some are specific to modules, like the Keep Regex `%original%`

## list of global tags

## all global tags

### `%rand%`

- `%rand%` - random bit (0 or 1)
- `%rand()` - alias for `%rand%`
- `%rand(max)%` - number from 0 to max, inclusive of both
- `%rand(min, max)%` - number from min to max, inclusive of both
