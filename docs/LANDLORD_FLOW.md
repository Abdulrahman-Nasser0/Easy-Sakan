# Easy Sakan - Landlord Flow & Features

## Overview
The landlord flow within Easy Sakan ensures that property owners can efficiently manage their real estate catalog, upload properties, manage availability, edit details, and track performance inside their dashboard.

## 1. Landlord Dashboard (`/dashboard/landlord`)
The primary overview for property owners with dynamic metrics calculated based on their real estate catalog.
- **Dynamic Stats Grid**: Shows Total Properties, Properties Pending Approval, Active Bookings (occupied slots across listings), and Estimated Revenue.
- **Quick Links**:
  - `Upload New Property`: Navigate quickly to `/dashboard/landlord/properties/new`.
  - `View My Listings`: Opens the `/dashboard/landlord/my-listings` view with filters and list.
- **Dynamic Top Properties Showcase**: The dashboard loads your top list of properties showing live status (APPROVED, PENDING, REJECTED) with image thumbnails, direct Edit links, and active bookings displayed explicitly. 

## 2. Property Upload (`/dashboard/landlord/properties/new`)
A robust 2-step creation form for defining property details.
- **Data Elements**: Title, description, price, area in sqm, standard location (city/address), configuration (bedrooms, bathrooms, amenities like WiFi, AC), and demographic targeting (Male/Female/Any).
- **Backend Flow**: Form maps locally to `POST /api/properties` payload.
- **Images Flow**: On successful payload submission, a sequential POST request uploads the multiple `FormData()` property images explicitly via `POST /api/properties/{id}/images`.

## 3. Manage Listings (`/dashboard/landlord/my-listings`)
Comprehensive list interface to view all properties created by the landlord.
- **Filters**: Quickly filter properties by Status (`APPROVED`, `PENDING_APPROVAL`, `REJECTED`).
- **Table View**: Summarizes Property Title, Status, Price, Availability slots vs Total capacity (e.g. 1/3), Current Bookings, and visibility state (Shown vs Hidden).
- **Action - Toggle Visibility**: Pause listings temporarily via `PUT /api/properties/{id}/availability`. Converts availability property flag dynamically without destroying data.
- **Action - Delete Property**: Completely tear down property via `DELETE /api/properties/{id}` followed by an explicit modal confirmation to prevent accidental loss.
- **Action - Edit Property**: Proceeds to the dedicated edit flow.

## 4. Edit Property (`/dashboard/landlord/properties/[id]/edit`)
New fully functional form mapping securely onto the edit flow (implemented to fulfill missing API parity).
- **Initialization**: Automatically invokes `GET /api/properties/{id}` to load the latest backend record including current metrics, textual data, and visual images.
- **Text Edition**: Exposes `PUT /api/properties/{id}` pushing modified prices, features, or restrictions.
- **Iterative Image Updates**: Performs differential image processing. Deletes explicitly removed images via `DELETE /api/properties/{id}/images/{imageId}` sequentially, and bulk pushes newly added attachments via `POST /api/properties/{id}/images`.

## 5. Security & Roles
All landlord pages utilize Next.js Server Components that parse the `<SessionData>` secure tokens (`Role = "Landlord" | "Admin"`). Non-landlord accounts trying to access `dashboard/landlord/*` are explicitly blocked and redirected seamlessly to `/dashboard/student`. Token boundaries map transparently downwards to the `Authorization` header inside the `apiCall` wrapper.
