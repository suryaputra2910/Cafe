async function test() {
  const res = await fetch('https://cafereserved-production.up.railway.app/tables');
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
test();
