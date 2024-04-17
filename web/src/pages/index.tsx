import { useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import Pagination from 'react-bootstrap/Pagination';
import { Alert, Container } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: TUserItem[]
}


export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch("http://localhost:3000/users?page=1&limit=20", { method: 'GET' })
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [] } }
    }

    return {
      props: { statusCode: 200, users: await res.json() }
    }
  } catch (e) {
    return { props: { statusCode: 500, users: [] } }
  }
}) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({ statusCode, users }: TGetServerSideProps) {
  const [paginationData, setPaginationData] = useState({
    usersData: users,
    activePage: 1,
    pagesCount: 10
  });

  const handlePageChange = async (pageNumber: any) => {
    setPaginationData((prev) => ({ ...prev, activePage: pageNumber }));

    const res = await fetch(`http://localhost:3000/users?page=${pageNumber}&limit=20`).then(res => res.json());

    setPaginationData((prev) => ({
      ...prev,
      usersData: res
    }));
  }

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {
                paginationData.usersData.map((user: TUserItem) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.updatedAt}</td>
                  </tr>
                ))
              }
            </tbody>
          </Table>

          {/*TODO add pagination*/}

          <Pagination>
            {paginationData.usersData.slice(0, paginationData.pagesCount).map((_, index) => {
              index = index + 1

              return (
                <Pagination.Item
                  onClick={() => handlePageChange(index)}
                  key={index}
                  active={index === paginationData.activePage}
                >
                  {index}
                </Pagination.Item>
              );
            })}
          </Pagination>

        </Container>
      </main>
    </>
  );
}
