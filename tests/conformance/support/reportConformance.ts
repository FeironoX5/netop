export type ConformanceObservation<Details = object> = {
  result: { delivered: boolean };
  details: Details;
};

export function reportConformance(
  scenario: object,
  netemul: ConformanceObservation,
  netop: ConformanceObservation,
): void {
  console.info(
    JSON.stringify({ scenario, netemul, netop }, null, 2),
  );
}
