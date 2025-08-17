import z from 'zod';

export const EmployeeScheme = z.object({
    id: z.string().optional(),
    fullName: z.string().min(3).max(100),
    avatar: z.union([z.url(), z.literal("")]).optional(),
    department: z.string().min(2).max(15),
    birthDate: z.iso.date().min(10).max(10),
    salary: z.number().min(1000).max(1000000)
});

export const PartialEmployeeScheme = EmployeeScheme.partial();