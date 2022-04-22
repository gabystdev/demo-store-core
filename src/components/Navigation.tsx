import { Link } from "#i18n/Link";
import { useRouter } from "next/router";
import { FC } from "react";

export const Navigation: FC = () => {
  const router = useRouter()

  return (
    <div>
      <p>Navigation</p>

      <p>
        <Link href='/'>
          <a>Home</a>
        </Link>

        &nbsp;&nbsp;|&nbsp;&nbsp;

        <Link locale=''>
          <a>Country Selector</a>
        </Link>

        {
          router?.pathname !== '/' && (
            <>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/another'>
                <a>Another Page</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/1'>
                <a>Page 1</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/1/other'>
                <a>Page 1 - other</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/2'>
                <a>Page 2</a>
              </Link>

              &nbsp;&nbsp;|&nbsp;&nbsp;
              <Link href='/2/other'>
                <a>Page 2 - other</a>
              </Link>
            </>
          )
        }
      </p>

    </div>
  )
}