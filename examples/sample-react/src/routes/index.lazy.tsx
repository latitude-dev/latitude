import { createLazyFileRoute } from '@tanstack/react-router'

function Index() {
  return (
    <div className='py-20 flex flex-col gap-y-4 max-w-[400px] mx-auto'>
      <p>
        This sample project demonstrates the integration of Latitude data
        projects within a React application. It showcases various use cases and
        provides practical examples of how to utilize Latitude data effectively
        in your front-end projects.
      </p>

      <p>
        Explore the sample code to better understand how to implement Latitude
        data solutions within a React framework. The examples are designed to be
        clear and easily adaptable to your specific needs, ensuring a smooth
        integration process for developers of all skill levels.
      </p>
    </div>
  )
}

export const Route = createLazyFileRoute('/')({
  component: Index,
})
