import { asText } from '@prismicio/helpers';
import { GetStaticProps } from 'next';
import Head from 'next/head'
import { useState } from 'react';
import Header from '../components/Header';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';
import commonStyles from '../styles/common.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<PostPagination>(postsPagination);

  const handleSearchPost = async () => {
    if (posts.next_page) {
      const response: PostPagination = await fetch(posts.next_page).then(result => result.json());
      const newPage = response.results.map(post => ({
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }
      }))

      const next_page = response.next_page;

      const data = {
        results: [...posts.results, ...newPage], next_page
      }

      setPosts(data);
    }
  }

  return (
    <main className={`${styles.container} ${commonStyles.container}`}>
      <Head>
        <title>Home | BlogSeat</title>
      </Head>
      <Header />
      <section className={styles.posts}>
        {posts.results.map(post => {
          return (
            <Link href={`/post/${post.uid}`}>
              <div key={post.uid}>
                <header>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                </header>
                <div className={styles.footerPost}>
                  <time>
                    {post.first_publication_date}
                  </time>
                  <p>
                    {post.data.author}
                  </p>
                </div>
              </div>

            </Link>

          )
        })}
      </section>
      {posts.next_page && (
        <button
          className={styles.btn_loading}
          onClick={handleSearchPost}
        >
          Carregar mais posts
        </button>
      )}
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('blog-rocketseat', {
    lang: 'pt-BR',
    pageSize: 1,
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
  });

  const results = postsResponse.results.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author
    }
  }))

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results
      }
    }

  }

};
