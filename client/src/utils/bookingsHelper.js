// Filter for accepted requests
export const acceptedRequests = (requests, today, userId, isSitter) => {
  if (isSitter) {
    return requests.filter(
      (request) =>
        request.accepted &&
        request.sitterId._id === userId &&
        request.start > today
    );
  } else {
    return requests.filter(
      (request) =>
        request.accepted &&
        request.ownerId._id === userId &&
        request.start > today
    );
  }
};

// Find next sitter booking.
export const getNextSitterBooking = (requests, today, userId) => {
  const bookings = acceptedRequests(requests, today, userId, true);
  if (bookings.length > 0) {
    return bookings[bookings.length - 1];
  } else {
    return false;
  }
};

// Find next owner booking
export const getNextOwnerBooking = (requests, today, userId) => {
  const bookings = acceptedRequests(requests, today, userId, false);
  if (bookings.length > 0) {
    return bookings[bookings.length - 1];
  } else {
    return false;
  }
};
