import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Here you would typically save the customer data to a database
    // For this example, we'll just log it and return a success response
    console.log('Received customer data:', body)

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({ message: 'Customer created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}