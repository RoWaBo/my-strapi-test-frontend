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

    const sortByDate = (course: Course) => {
        const courseEvents = course.attributes.course_event
        const sortByNewestDate = course.attributes.sort_course_events_by_newest_date

        if (sortByNewestDate && courseEvents) {
            return courseEvents.sort((a, b) => new Date(b.start_date).valueOf() - new Date(a.start_date).valueOf())
        }
        return courseEvents
    }

    const formatDate = (date: string) => {
        const dateSplit = date.split('-')
        const year = dateSplit[0]
        let month = dateSplit[1]
        switch (month) {
            case '01': month = 'Jan'
                break;
            case '02': month = 'Feb'
                break;
            case '03': month = 'Mar'
                break;
            case '04': month = 'Apr'
                break;
            case '05': month = 'May'
                break;
            case '06': month = 'Jun'
                break;
            case '07': month = 'Jul'
                break;
            case '08': month = 'Aug'
                break;
            case '09': month = 'Sep'
                break;
            case '10': month = 'Oct'
                break;
            case '11': month = 'Nov'
                break;
            case '12': month = 'Dec'
                break;
        }
        return `${month} ${year}`
    }

    return (
        <>
            {courses.map(course => (
                <article key={course.id} className="shadow-lg border rounded-lg overflow-hidden mb-10 py-4 bg-white">
                    <header className="px-4 pb-8">
                        <h2 className="capitalize text-xl md:text-3xl">{course.attributes.title}</h2>
                        {course.attributes.description && (
                            <>
                                <ReactMarkdown className="mt-2">{course.attributes.description}</ReactMarkdown>
                            </>
                        )}
                    </header>
                    <ul>
                        {course && sortByDate(course).map(event => (
                            <li key={event.id} className="border-t py-4 px-10 list-disc">
                                <h3 className="text-base mb-1">{event.title}</h3>
                                <div className="flex items-center">
                                    <CalendarIcon height={17} width={17} className="text-gray-500 mr-2" />
                                    <p className="text-sm text-gray-500">{formatDate(event.start_date)}</p>
                                    {event.End_date && (
                                        <>
                                            <MinusIcon height={10} width={10} className="text-gray-500 mx-[6px] mt-[2px]" />
                                            <p className="text-sm text-gray-500">{formatDate(event.End_date)}</p>
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
            fields: ['title', 'description', 'sort_course_events_by_newest_date'],
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