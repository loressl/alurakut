import React from 'react';
import MainGrid from "../src/components/MainGrind";
import Box from "../src/components/Box";
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper, ProfileRelations } from '../src/components/ProfileRelations';
import nookies from 'nookies';
import { isEmpty } from 'lodash';

import jwt from 'jsonwebtoken';

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

export default function Home(props) {
  const githubUser = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]);

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
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      })

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'c40b9455c18a4fc888f8408042e4e0',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query {
          allCommunities {
            id 
            title
            imageUrl
            creatorSlug
          }
        }` })
    })
      .then((response) => response.json()) // Pega o retorno do response.json() e j?? retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindasDoDato)
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
            <h2 className="subTitle">O que voc?? deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);
              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser
              }
              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
                .then(async (response) => {
                  const dados = await response.json();
                  //console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas)
                })
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

export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.USER_TOKEN;
  let githubUser = '';
  if (!isEmpty(token)) {
    githubUser = jwt.decode(token).githubUser;
  }

  //https://alurakut.vercel.app/api/auth <<< sempre retorna true e est?? dando erro

  const status = await fetch(`https://api.github.com/users/${githubUser}`)
    .then(async (resposta) => resposta.status)
    .catch((err) => console.log(err))

  if (status === 404) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  // const followers = await fetch(`https://api.github.com/users/${githubUser}/followers`)
  //   .then((res) => res.json())
  //   .then(followers => followers.map((follower) => ({
  //     id: follower.id,
  //     name: follower.login,
  //     image: follower.avatar_url,
  //   })));

  return {
    props: {
      githubUser,
    }
  }
}