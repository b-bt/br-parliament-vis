import * as d3 from "https://cdn.skypack.dev/d3@7";

export const fetchSenatorsSortedByParty = async () => {
  let data = await d3.json("https://raw.githubusercontent.com/b-bt/br-parliament-vis/main/data.json")

  const senatorsData = data.ListaParlamentarEmExercicio.Parlamentares.Parlamentar
  const senators = senatorsData.map((senator) => mapUsableSenatorData(senator))
  
  return sortedSenatorsByParty(senators)
}

const mapUsableSenatorData = (senatorData) => {
  return {
    name: senatorData.IdentificacaoParlamentar.NomeParlamentar,
    fullName: senatorData.IdentificacaoParlamentar.NomeCompletoParlamentar,
    photoUrl: senatorData.IdentificacaoParlamentar.UrlFotoParlamentar,
    party: senatorData.IdentificacaoParlamentar.SiglaPartidoParlamentar,
    uf: senatorData.Mandato.UfParlamentar
  }
}

const sortedSenatorsByParty = (senators) => {
  senators.sort((a, b) => {
    if (a.party < b.party) {
      return -1
    }
    if (b.party < a.party) {
      return 1
    }
    return 0;
  })

  return senators
}