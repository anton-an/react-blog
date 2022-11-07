export default function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, index]) => index != null && index !== '')
      .map(([item, index]) => [item, index === Object(index) ? removeEmpty(index) : index])
  )
}
