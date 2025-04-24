import { Event } from "@/app/generated/prisma";
import { Button } from "@heroui/react";

interface GoogleCalendarButtonProps {
    event: Event;
}

const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");

const GoogleCalendarButton = ({ event }: GoogleCalendarButtonProps) => {
    const handleAddToGoogleCalendar = () => {
        const googleCalendarUrl = new URL("https://www.google.com/calendar/render");
        googleCalendarUrl.searchParams.append("action", "TEMPLATE");
        googleCalendarUrl.searchParams.append("text", event.name);
        googleCalendarUrl.searchParams.append("details", event.description);
        googleCalendarUrl.searchParams.append("dates", `${formatDate(event.start)}/${formatDate(event.end)}`);

        if (event.address) {
            googleCalendarUrl.searchParams.append("location", event.address);
        }

        window.open(googleCalendarUrl.toString(), "_blank");
    };

    return (
        <Button color="primary" onPress={handleAddToGoogleCalendar} className="mt-4">
            Добавить в календарь
        </Button>
    );
};

export default GoogleCalendarButton;
