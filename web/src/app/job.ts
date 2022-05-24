export interface Job {

    id: number;

    title: string;
    description: string;

    location: string;

    employer: string;
    contact_information: string;

    is_active: boolean;
    is_sponsored: boolean;

    published_at: string;

}