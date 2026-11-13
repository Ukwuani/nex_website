---
title: Expressions
description: The expression language used by expression tags, view bindings, alarm enable conditions and transaction triggers - references, operators and every function.
---

Expressions compute a value from tags. You write them in:

- **Expression tags** (see [Tags](../tags/#expression-tags)).
- **View bindings**, to drive a symbol property from a calculation (see [Views](../views/#bindings)).
- **Alarm enable conditions**, so an alarm only applies while, say, the line is running (see [Alarms](../alarms/#alarm-details)).
- **UDT template members**, with `${parameters}` filled in per instance.

The language is small and sandboxed: an expression can only read the values it references and call the functions listed below.

## Examples

```
{plant.t101.level} * 1.8 + 32
if({pump.running} && {pump.speed} > 0, "Running", "Stopped")
clamp(avg({a}, {b}, {c}), 0, 100)
{line1.motor.current} > 40 and not {line1.maintenance}
numberFormat({flow.total} / 1000, 1)
```

## References

A reference is a tag ID in braces: `{plant.t101.level}`.

- **Array elements:** `{line.estop[2]}` reads the third element of an array tag.
- **In views,** a reference can also name a view parameter, and `${param}` inside a tag ID is replaced by the parameter's value: `{${pump}.speed}` reads the speed of whichever pump the view was opened for.
- **In UDT templates,** `${prefix}` is the instance's tag ID prefix, so `{${prefix}.Current} > ${ratedAmps}` compares this instance's current with its own parameter.
- **Edge gateway tags** are referenced with the edge's name: `{@line1-edge/line1.speed}`.

## Values and literals

| Literal | Examples |
|---|---|
| Numbers | `42`, `3.14`, `-0.5` |
| Text | `"Running"` or `'Running'` |
| Booleans | `true`, `false` |
| Nothing | `null` |

## Operators

From lowest to highest precedence:

| Operators | Meaning |
|---|---|
| `a ? b : c` | Conditional: `b` if `a` is true, otherwise `c` |
| `\|\|` or `or` | Either is true |
| `&&` or `and` | Both are true |
| `==`, `!=` | Equal, not equal |
| `<`, `<=`, `>`, `>=` | Comparisons |
| `+`, `-` | Add and subtract (`+` joins text) |
| `*`, `/`, `%` | Multiply, divide, remainder |
| `^` | Power |
| `!` or `not`, unary `-` | Not, negate |

Use parentheses to group: `({a} + {b}) / 2`.

## Functions

### Maths

| Function | Returns |
|---|---|
| `abs(x)` | The absolute value |
| `round(x, digits?)` | `x` rounded, to `digits` decimals (default 0) |
| `floor(x)`, `ceil(x)` | Rounded down, rounded up |
| `sqrt(x)`, `pow(x, y)`, `exp(x)` | Square root, `x` to the power `y`, e to the power `x` |
| `log(x)`, `log10(x)` | Natural and base-10 logarithm |
| `sin(x)`, `cos(x)`, `tan(x)` | Trigonometry, in radians |
| `min(a, b, …)`, `max(a, b, …)` | The smallest, the largest (also of an array) |
| `sum(a, b, …)`, `avg(a, b, …)` | The total, the mean (also of an array) |
| `clamp(x, lo, hi)` | `x` kept within `lo`…`hi` |
| `scale(x, inLo, inHi, outLo, outHi)` | `x` mapped from one range to another |

### Logic

| Function | Returns |
|---|---|
| `if(condition, then, else)` | `then` if the condition is true, otherwise `else` |
| `coalesce(a, b, …)` | The first value that isn't null |
| `isNull(x)` | Whether `x` is null |

### Conversion

| Function | Returns |
|---|---|
| `toNumber(x)`, `toInt(x)` | `x` as a number, as a whole number |
| `toBool(x)` | `x` as true/false |
| `toString(x)`, `str(x)` | `x` as text |

### Text

| Function | Returns |
|---|---|
| `concat(a, b, …)` | The values joined as text |
| `upper(s)`, `lower(s)`, `trim(s)` | Upper case, lower case, without surrounding spaces |
| `contains(s, part)` | Whether `s` contains `part` |
| `substring(s, start, end?)` | Part of `s` |
| `len(s)` | The length of text, an array or a document |
| `numberFormat(x, digits)` | `x` as text with `digits` decimals |

### Arrays, documents and datasets

| Function | Returns |
|---|---|
| `at(array, index)` | One element (counting from 0) |
| `jsonGet(document, "a.b[2]")` | A value inside a document tag |
| `rowCount(dataset)`, `columnCount(dataset)` | The size of a dataset |
| `cell(dataset, row, column)` | One cell, by row number and column name or number |

### Time

| Function | Returns |
|---|---|
| `now()` | The current time in milliseconds since 1970 |

Function names are not case-sensitive: `numberFormat` and `numberformat` are the same.

## Checking expressions

The editor checks an expression as you type: unknown functions, the wrong number of arguments and syntax errors are shown before you save. Tag Explorer shows a diagnostic on an expression tag whose references don't exist.
