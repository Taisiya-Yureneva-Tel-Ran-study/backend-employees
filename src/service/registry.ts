import EmployeeService from "./EmployeeService.ts";

type Factory = (deps: any) => Promise<EmployeeService>;

const registry = new Map<string, Factory>();

export function registerEmployeeService(key: string, factory: Factory): void {
    if (registry.has(key)) {
        throw new Error(`Service ${key} already registered`);
    }
    registry.set(key, factory);
}

export async function createEmployeeService(key: string, deps: any = {}): Promise<EmployeeService> {
    if (!registry.has(key)){
        throw new Error(`Service ${key} not found, select from ${listEmployeesServices().join("; ")}`);
    }

    return registry.get(key)(deps);
}

export function listEmployeesServices(): string[] {
    return Array.from(registry.keys());
}