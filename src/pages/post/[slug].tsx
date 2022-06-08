import { asHTML, } from '@prismicio/helpers';
import { GetStaticPaths, GetStaticProps } from 'next';

import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi'

import { format } from 'date-fns';


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
  if (post?.data.title.length > 60) {
    title = post.data.title.slice(0, 60).concat('...');
  } else {
    title = post?.data.title;
  }

  const timeLearning = () => {
    let arr = post?.data.content;

    const total = arr?.map(content => {

      const allHeading = content.heading.split(" ").length

      const allContent = content.body.map(body => {
        return body.text.split(" ").length;
      })
      return [allHeading, ...allContent];

    }).flat().reduce((ac, el) => {
      ac += el
      return ac
    }, 0)

    let min = Math.ceil(Number(total) / 200);

    return min;

  }

  const time = timeLearning();


  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={styles.loading}>Carregando...</div>
    )
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
              <FiCalendar /> {format(
                new Date(post.first_publication_date),
                'dd/MM/yyyy'
              )}
            </time>
            <p><FiUser />{post.data.author}</p>
            <span>
              <FiClock /> {time} min
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
  const posts = await prismic.getByType('blog-rocketseat', {
    pageSize: 1
  });

  return {
    paths: [{
      params: { slug: posts.results[0].uid }
    }],
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('blog-rocketseat', String(slug))

  return {
    props: {
      post: response
    }
  }
};
