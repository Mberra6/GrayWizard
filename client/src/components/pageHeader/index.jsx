import './styles.scss';

/**
 * Functional React component for displaying a page header
 * This component accepts a header text and an icon as props and renders them within a layout
 *
 * @param {object} props - Component props.
 * @param {string} props.headerText - The text to display as the header
 * @param {JSX.Element} props.icon - The icon component to display next to the header text
 * @returns {JSX.Element} A React element containing the structured header content
 */
const PageHeaderContent = (props) => {
    // Destructuring props for easy access to headerText and icon
    const { headerText, icon } = props;

    // Render a div container that groups the header text and icon together
    return (
        <div className="wrapper">
            {/* Display the header text within an h2 tag */}
            <h2>{headerText}</h2>
            {/* Span container for the icon, allowing it to be styled separately if needed */}
            <span>{icon}</span>
        </div>
    );
}

// Export the PageHeaderContent component for use in other parts of the application
export default PageHeaderContent;
