import { asHTML } from '@prismicio/helpers';
import { asText } from '@prismicio/richtext';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  let title = "";
  if (post.data.title.length > 60) {
    title = post.data.title.slice(0, 60).concat('...');
  } else {
    title = post.data.title;
  }

  return (
    <main className={styles.container}>
      <Head>
        <title>
          {post.data.title}
        </title>
      </Head>
      <Header />
      <img className={styles.banner} src={post.data.banner.url} alt="banner" />
      <div className={`${styles.content} ${commonStyles.container}`}>
        <header>
          <h1>
            {title}
          </h1>

          <div className={styles.informacoes}>
            <time>
              {post.first_publication_date}
            </time>
            <p>{post.data.author}</p>
            <span>
              4 min
            </span>
          </div>

        </header>
        {post.data.content.map((content, index) => {
          function htmlSerializer(content) {
            content.body.map(body => {
              if (body.type === 'list-item') return `<li>${body.text}</li>`
            })
            return null
          }
          return (
            <article className={styles.group} key={index}>
              <h3
                dangerouslySetInnerHTML={{ __html: content.heading }}
              >
              </h3>
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: asHTML<any>(content.body, null, htmlSerializer(content)) }}
              >
              </div>


            </article>
          )
        })}
      </div>
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  // const posts = await prismic.getByType(TODO);

  return {
    paths: [],
    fallback: true
  }
  // TODO
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('blog-rocketseat', String(slug))

  console.log(JSON.stringify(response, null, 2));
  return {
    props: {
      post: response
    }
  }
};
