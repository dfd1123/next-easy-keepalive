import type { NextPage } from 'next';
import {useRouter} from "next/router";

const DetailPage: NextPage = () => {
    const {query} = useRouter();
    const pageId = query.pageId as string;

    return (
        <div>
            {pageId} PAGE
        </div>
    )
}

export default DetailPage;