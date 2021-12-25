import { CalendarIcon, MinusIcon } from "@heroicons/react/outline";
import axios from "axios";
import { GetStaticProps } from "next";
import qs from "qs";
import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";
import { getStrapiURL } from "../helperFunctions";
import { Course } from "../types/collectionTypes";

interface CoursesProps {
    courses: Course[]
}

const Courses: FunctionComponent<CoursesProps> = ({ courses }) => {
    console.log(courses);
    const createDate = (date: string) => {
        const newDate = new Date(date)
        console.log(newDate);
        // return newDate.toString()
    }
    return (
        <>
            {courses.map(course => (
                <article key={course.id} className="shadow border rounded-lg overflow-hidden">
                    <header className="p-4 border-b-2">
                        <h2 className="capitalize text-2xl md:text-3xl">{course.attributes.title}</h2>
                        {course.attributes.description && (
                            <>
                                <ReactMarkdown className="mt-2">{course.attributes.description}</ReactMarkdown>
                            </>
                        )}
                    </header>
                    <ul>
                        {course.attributes.course_event?.map(event => (
                            <li key={event.id} className="border-b py-4 mx-9">
                                {createDate(event.start_date)}
                                <h3 className="text-lg mb-1">{event.title}</h3>
                                <div className="flex items-center">
                                    <CalendarIcon height={17} width={17} className="text-gray-500 mr-2" />
                                    <p className="text-sm text-gray-500">{event.start_date}</p>
                                    {event.End_date && (
                                        <>
                                            <MinusIcon height={10} width={10} className="text-gray-500 mx-[6px] mt-[2px]" />
                                            <p className="text-sm text-gray-500">{event.End_date}</p>
                                        </>
                                    )}
                                </div>
                                {event.description && (
                                    <p className="mt-4">{event.description}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                </article>
            ))}
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {

    try {
        // STRAPI AUTH
        const { data: auth } = await axios.post(getStrapiURL('/api/auth/local'), {
            identifier: process.env.AUTH_IDENTIFIER,
            password: process.env.AUTH_PASSWORD,
        });

        // STRAPI GET 
        const query = qs.stringify({
            fields: ['title', 'description'],
            populate: {
                course_event: {
                    populate: {
                        files: {
                            fields: ['name', 'url', 'id']
                        }
                    },
                },
            },
        }, {
            encodeValuesOnly: true,
        });

        const { data } = await axios.get(getStrapiURL(`/api/courses?${query}`), {
            headers: {
                Authorization:
                    `Bearer ${auth.jwt}`,
            },
        })

        const courses = await data.data

        return {
            props: {
                courses
            },
            revalidate: 60,
        };
    } catch (err) {
        return {
            notFound: true
        }
    }
};

export default Courses;