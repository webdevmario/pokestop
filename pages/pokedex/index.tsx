function PokedexScreen() {
  const apiHandler = async () => {
    const response = await fetch("/api/hello");
    const json = await response.json();

    console.log("json", json);
  };

  return (
    <main className={`flex flex-col items-center justify-between p-24`}>
      <h1>Pokedex</h1>
      <div>
        <button onClick={apiHandler}>API Test</button>
      </div>
    </main>
  );
}

export default PokedexScreen;
