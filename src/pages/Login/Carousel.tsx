// Carousel.tsx
import React from 'react';
import styles from './Login.module.css'

// Define the type for each carousel item
type CarouselItem = {
    id: string;
    title: string;
    body: string;
};

// Define the array with type safety
const carouselData: CarouselItem[] = [
    {
        id: 'carousel_1',
        title: 'Inspire teamwork <br/>and stay connected',
        body: 'Workfreeli replaces the many apps today\'s teams rely <br/> on with a single platform that combines chat, calls, <br/> file and task management.',
    },
];

const Carousel: React.FC = () => {
    const currentItem = carouselData[0];

    const dynamicClass =
        currentItem.id === 'carousel_2'
            ? 'encryption'
            : currentItem.id === 'carousel_3'
                ? 'collaboration'
                : '';

    return (
        <div className={`${styles.FebBody} ${dynamicClass}`} key={currentItem.id}>
            <p
                className={styles.FebBodyText1}
                dangerouslySetInnerHTML={{ __html: currentItem.title }}
            ></p>
            <p
                className={styles.FebBodyText2}
                dangerouslySetInnerHTML={{ __html: currentItem.body }}
            ></p>
        </div>
    );
};

export default Carousel;
