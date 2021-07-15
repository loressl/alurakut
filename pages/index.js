import React from 'react';
import MainGrid from "../src/components/MainGrind";
import Box from "../src/components/Box";
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper, ProfileRelations, ProfileRelationsBoxUsers } from '../src/components/ProfileRelations';

function ProfileSideBar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

//REVER
// const ProfileRelationsBoxUsers=(props) =>{
//   console.log(props)
//   return (
//     <ProfileRelationsBoxWrapper>
//       <h2 className="smallTitle">
//         {props.title} ({props.items.length})
//       </h2>
//       <ul>
//         {props.items.slice(0, 6).map((itemAtual) => {
//           return (
//             <li key={itemAtual.id}>
//               <a href={itemAtual.url}>
//                 <img src={`https://github.com/${itemAtual.login}.png`} />
//                 <span>{itemAtual.login}</span>
//               </a>
//             </li>
//           )
//         })}
//       </ul>
//     </ProfileRelationsBoxWrapper>
//   )
// }

export default function Home() {
  const githubUser = 'loressl';

  const [comunidades, setComunidades] = React.useState([{
    id: '12802378123789378912789789123896123',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);

  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {
    fetch('https://api.github.com/users/loressl/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      })
  }, [])

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSideBar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              const comunidade = {
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image'),
              }
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas)
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelations>
            <h2 className="smallTitle">
              Seguidores ({seguidores.length})
            </h2>
            <ul>
              {seguidores.slice(0, 6).map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={itemAtual.url}>
                      <img src={`https://github.com/${itemAtual.login}.png`} />
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelations>
          <ProfileRelationsBoxWrapper
            title="Comunidades"
            items={comunidades}
          />
          <ProfileRelations>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelations>
        </div>
      </MainGrid>
    </>
  )
}
