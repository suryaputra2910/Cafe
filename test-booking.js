async function test() {
  const email = `test${Date.now()}@example.com`;
  const res = await fetch('https://cafereserved-production.up.railway.app/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "Test User", email, password: "StrongPassword123!", phone: "123456" })
  });
  console.log("Register:", await res.json());

  const res2 = await fetch('https://cafereserved-production.up.railway.app/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: "StrongPassword123!" })
  });
  const loginData = await res2.json();
  console.log("Login:", loginData);
  const token = loginData.accessToken;

  // fetch tables
  const res3 = await fetch('https://cafereserved-production.up.railway.app/tables', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const tablesResponse = await res3.json();
  const tables = tablesResponse.data;
  console.log("Tables:", tables.slice(0, 2));

  // book
  const tableId = tables[0].id;
  const bookingBody = {
    tableId,
    bookingDate: "2026-10-10",
    startTime: "19:00",
    endTime: "21:00",
    guestcount: 2,
    notes: ""
  };
  console.log("Booking 1 body:", bookingBody);
  const res4 = await fetch('https://cafereserved-production.up.railway.app/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(bookingBody)
  });
  console.log("Booking 1:", await res4.json());

  // book again to trigger conflict
  console.log("Booking 2 body:", bookingBody);
  const res5 = await fetch('https://cafereserved-production.up.railway.app/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(bookingBody)
  });
  console.log("Booking 2:", await res5.json());
}
test();
