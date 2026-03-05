export const fetchDictionaryData = async (searchWord) => {
  const dictResponse = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
  );
  const dictData = await dictResponse.json();

  const synResponse = await fetch(
    `https://api.datamuse.com/words?rel_syn=${searchWord}`
  );
  const synData = await synResponse.json();

  const antResponse = await fetch(
    `https://api.datamuse.com/words?rel_ant=${searchWord}`
  );
  const antData = await antResponse.json();

  return { dict: dictData, syn: synData, ant: antData };
};
